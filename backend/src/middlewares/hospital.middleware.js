export function verifyHospital(req, res, next) {
  if (req.user.role !== "HOSPITAL") {
    return res.status(403).json({ message: "Hospital access only" });
  }
  next();
}