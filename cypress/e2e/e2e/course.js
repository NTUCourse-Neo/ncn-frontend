describe("Course related functionalties test", () => {
  it("Navigate to /course page", () => {
    cy.visit("/");
    cy.get("button").contains("開始使用").click();
    cy.url().should("include", "/course");
  });
  it("Search without typing anything", () => {
    cy.intercept(
      "POST",
      `${Cypress.env("API_ENDPOINT")}${Cypress.env(
        "API_VERSION"
      )}/courses/search`
    ).as("search-IDs");
    cy.intercept(
      "POST",
      `${Cypress.env("API_ENDPOINT")}${Cypress.env("API_VERSION")}/courses/ids`
    ).as("search-courses");
    cy.get(".css-so5vyr").contains("搜尋").click();

    cy.wait(["@search-IDs", "@search-courses"]);
    cy.get(".css-1xcdwtr").contains("共找到 10935 筆結果");
  });
});
