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
    cy.get("button").contains("了解更多").click();
    cy.url().should("include", "/about");
    cy.go(-1);
    cy.get("button").contains("關於").click();
    cy.url().should("include", "/about");
  });
  it("Navigate to recruiting page", () => {
    cy.visit("/");
    cy.get("button").contains("加入我們").click();
    cy.url().should("include", "/recruiting");
    cy.go(-1);
    cy.get("button").contains("夥伴招募").click();
    cy.url().should("include", "/recruiting");
  });
});