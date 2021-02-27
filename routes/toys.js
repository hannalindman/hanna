const express = require('express');
const router = express.Router();
const { ToysModel, validToy } = require("../models/toyModel");
const { authToken } = require("../middlewares/auth");


router.get('/', async (req, res) => {
  let search = req.query.s;
  let regExp = new RegExp(search, "i");
  let perPage = (req.query.perPage) ? Number(req.query.perPage) : 10;
  let page = req.query.page;
  let sortQ = (req.query.sort) ? req.query.sort : "_id";
  let ifRevers = (req.query.ifRevers == "no") ? 1 : -1;
  let minP = (req.query.min) ? Number(req.query.min) : 10;
  let maxP = (req.query.max) ? Number(req.query.max) : 100;
  try {
    let data = await ToysModel.find({ $or: [{ name: regExp }, { info: regExp } ], price: { $gte: minP, $lte: maxP }})
      .sort({ [sortQ]: ifRevers })
      .limit(perPage)
      .skip(page * perPage)
    res.json(data);
  }
  catch (err) {
    console.log(err);
    res.status(400).json({ err: "there is a problem, try again later!" })
  }
});


router.post('/', authToken, async (req, res) => {
  let validate = validToy(req.body);
  if (validate.error) {
    return res.status(400).json(validate.error.details)
  }
  try {
    let toy = new ToysModel(req.body);
    toy.user_id = req.userData._id
    await toy.save();
    res.status(201).json(toy)
  }
  catch (err) {
    console.log(err);
    res.status(400).json({ err: "there is a problem, try again later!" })
  }
})


router.put("/:editId", authToken, async (req, res) => {
  let editId = req.params.editId;
  let validBody = validToy(req.body);
  if (validBody.error) {
    return res.status(400).json(validBody.error.details);
  }
  try {
    let toy = await ToysModel.updateOne({ _id: editId, user_id: req.userData._id }, req.body);
    res.json(toy);
  }
  catch (err) {
    console.log(err);
    res.status(400).json(err);
  }
})


router.delete("/:delId", authToken, async (req, res) => {
  let delId = req.params.delId;
  try {
    let toy = await ToysModel.deleteOne({ _id: delId, user_id: req.userData._id });
    res.json(toy);
  }
  catch (err) {
    console.log(err);
    res.status(400).json(err);
  }
})


module.exports = router;