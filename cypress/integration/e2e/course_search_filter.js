describe("Course related functionalties test", () => {
  const filter_btns = ["課程時間", "開課系所", "課程類別"];
  const filter_toggle_ids = ["filter_toggle_time", "filter_toggle_department", "filter_toggle_category"];
  it("Expend and check initial components", () => {
    cy.visit("/course");
    cy.get("#toggle_filter_drawer").click();
    cy.get("button").contains("篩選").click();
    filter_btns.forEach(btn_text => {
      cy.get("button").should("be.disabled").contains(btn_text);
    });
    cy.get("button").contains("設定").click();
    cy.get("p").contains("課表設定");
    cy.get("p").contains("自訂顯示欄位");
  });
  it("Check filter toggles, buttons and models", () => {
    cy.get("button").contains("篩選").click();
    filter_toggle_ids.forEach(id => {
      cy.get("#" + id).siblings(".chakra-switch__track").click();
      cy.get("button").should("be.enabled").contains(filter_btns[filter_toggle_ids.indexOf(id)]).click();
      cy.get(".chakra-modal__close-btn").click();
    });
  });
  it("Check filter toggles, buttons and models", () => {
    const enroll_methods = ["直接加選", "授權碼加選", "登記後加選"]
    cy.get("button").contains("篩選").click();
    cy.get("button").should("be.disabled").contains("加選方式");
    cy.get("#filter_toggle_enroll").siblings(".chakra-switch__track").click();
    cy.get("button").should("be.enabled").contains("加選方式").parent().click();
    enroll_methods.forEach(method => {
      cy.get("button").contains(method).parent().should("have.attr", "aria-checked", "true").click();
      cy.get("button").contains(method).parent().should("have.attr", "aria-checked", "false").click();
    });
    cy.get("button").should("be.enabled").contains("加選方式").parent().click();
  });
});