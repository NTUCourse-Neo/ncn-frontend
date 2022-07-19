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
    ).as("search-courses");
    cy.get(".css-bs7b3k").contains("搜尋").click();

    cy.wait(["@search-courses"]);
    cy.get(".css-1xcdwtr").contains("共找到 10935 筆結果");
  });
});
