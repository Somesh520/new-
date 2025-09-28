const app = require("./app");

const PORT = process.env.PORT || 5000;
  
app.get('/', (req, res) => {
  res.send('Kanchan Backend is running');
});
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server listening on http://0.0.0.0:${PORT}`);
});