// Verify Roles for Authentication
const verifyRole = require('../../validation/verifyRole');
const Item = require('../../models/Item');

// @route   DELETE api/items/delete/:id
// @desc    Removes the food item from the database
// @access  Private
const deleteItem = (req, res) => {
  const { id } = req.params;

  // Verify Roles
  verifyRole(req.user, res);

  Item.findOneAndRemove({ _id: id })
    .then((removedItem) => {
      res.status(200).json({ removedItem, msg: 'Item deleted from the database.' });
    })
    .catch((err) => {
      res.status(500).json({ err, msg: 'Error communicating with the database.' });
    });
};

module.exports = { deleteItem };