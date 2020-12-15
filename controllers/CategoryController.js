const Category = require("../models/Category");
const { validationResult } = require("express-validator");

exports.addCategory = async (req, res) => {
  try {
    const { categoryName, description } = req.body;

    //fied validation
    const validationErr = validationResult(req);
    if (validationErr?.errors?.length > 0) {
      return res.status(400).json({ errors: validationErr.array() });
    }

    // category exist check
    const existCategory = await Category.findOne({
      categoryName: categoryName,
    });
    if (existCategory) {
      return res
        .status(400)
        .json({ errors: [{ message: "Category already exists" }] });
    }

    //save category
    const category = new Category({
      categoryName: categoryName,
      description: description,
    });

    // const category = new Category(req.body);
    const addedCategory = await category.save({ new: true });
    // res.status(200).send('Category added');
    res.status(200).json(addedCategory);
  } catch (error) {
    res.status(500).json({ errors: [{ message: error.message }] });
  }
};

exports.getCategory = async (req, res) => {
  try {
    const category = await Category.findById({ __id: req.params.id });
    res.status(200).json(category);
  } catch (error) {
    return res.status(500).json({ errors: [{ message: error.message }] });
  }
};

exports.updateCategory = async (req, res) => {
  try {
    // validation
    const validationErr = validationResult(req);
    if (validationErr?.errors?.length > 0) {
      return res.status(400).json({ errors: validationErr.array() });
    }

    // update
    const updatedCategory = await Category.findOneAndUpdate(
      { __id: req.body.id },
      { ...req.body, status: "updated", updatedDate: Date.now() },
      { new: true, runValidators: true }
    );

    // res.status(200).send("Category updated");
    res.status(200).json(updatedCategory);
  } catch (error) {
    return res.status(500).json({ errors: [{ message: error.message }] });
  }
};

exports.deleteCategory = async (req, res) => {
  try {
    const deletedCategory = await Category.findOneAndUpdate(
      { __id: req.params.id },
      {
        status: "deleted",
        deletedDate: Date.now(),
      },
      {
        new: true,
      }
    );
    res.status(200).json(deletedCategory);
  } catch (error) {
    return res.status(500).json({ errors: [{ message: error.message }] });
  }
};

exports.getCategories = async (req, res) => {
  try {
    const categories = await Category.find({})
      .where("status", /[^deleted]/)
      .select("-status");
    res.status(200).json(categories);
  } catch (error) {
    return res.status(500).json({ errors: [{ message: error.message }] });
  }
};

exports.destroyCategory = async (req, res) => {
  try {
    await Category.deleteOne({ __id: req.params.id });
    res.status(200).send("Category is deleted !!!");
  } catch (error) {
    return res.status(500).json({ errors: [{ message: error.message }] });
  }
};
