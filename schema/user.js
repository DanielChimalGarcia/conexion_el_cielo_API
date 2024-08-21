UserSchema.methods.usernameExist = async function (username) {
    const result = await Mongoose.model("User").findOne({ username });
    return !!result;
};

UserSchema.methods.comparePassword = async function (password, hash) {
    const same = await bcrypt.compare(password, hash);
    return same;
};

UserSchema.methods.createAccessToken = function () {
    return generateAccessToken();
};

UserSchema.methods.createRefreshToken = function () {};

module.exports = Mongoose.model("User", UserSchema);