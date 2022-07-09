describe("Home page e2e test", () => {
  it("Display home page title", () => {
    cy.visit("/");
    cy.contains("Course Schedule");
    cy.contains("Re-imagined.");
  });
  it("Navigate to course page", () => {
    cy.visit("/");
    cy.get("button").contains("開始使用").click();
    cy.url().should("include", "/course");
    cy.go(-1);
    cy.get("button").contains("課程").click();
    cy.url().should("include", "/course");
  });
  it("Navigate to about page", () => {
    cy.visit("/");
    cy.get(".css-jhyrsx").contains("了解更多").click();
    cy.get(".css-crqlo0", { timeout: 30000 });
    cy.url().should("include", "/about");
    cy.go(-1);
    cy.get("button").contains("關於").click();
    cy.url().should("include", "/about");
  });
});
