module.exports = (req,res,next) => {
    // get User from request then check if user is admin
    const user = req.user;
    if (!user) {
        return res.status(401).json({ message: "Invalid credentials" });
    }
    if (user.userRole !== "admin") {
        return res.status(401).json({ message: "Not an admin" });
    }

    next()

}