const getProfilePage = (req, res) => {
  console.log(req.user);
  res.render("profile", { user: req.user }); // Render profile page
};

export default { getProfilePage };
