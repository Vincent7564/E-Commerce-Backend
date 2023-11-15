const generateDynamicRoute = (baseRoute, dynamicParam) => {
    return `${baseRoute}/${dynamicParam}`;
  };

const roles = {
  101: [
  "/check-authorization",
  generateDynamicRoute("/edit-product",":id") 
],
  102: ["pageB"],
};

// 101 : Admin
// 102 : Cust

module.exports = roles;
