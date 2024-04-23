exports.renderPage = function (template, title) {
   return function (req, res) {
      res.render(template, { title });
   };
};
