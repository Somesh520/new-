exports.validate = (schema) => {
  return (req, res, next) => {
    try {
      const result = schema.safeParse(req.body);
      if (!result.success) {
        return res.status(400).json({ errors: result.error.errors });
      }
      req.body = result.data;
      next();
    } catch (err) {
      res.status(400).json({ errors: [{ message: err.message }] });
    }
  };
};
