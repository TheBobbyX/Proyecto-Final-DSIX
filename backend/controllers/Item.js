const { body, param, validationResult } = require('express-validator');

const { ItemModel } = require('../models/Item');


module.exports.validators = {
    getItems: [],
    createItem: [
        body('name', 'Name is required').exists(),
        body('price', 'Price is required').exists(),
        body('description', 'Description is required').exists(),
    ],
    deleteItem: [
        param('id', 'Id is required').exists(),
    ]
};

module.exports.controllers = {
    getItems: async (req, res, next) => {
        try {
            // Evaluate validations
            const errors = validationResult(req);
            if(!errors.isEmpty()){ return res.json(errors);}

            // Save in database
            const items = await ItemModel.find();  // TODO: Review why does not apply the filter
            res.json({ data: items, model: 'item', count: items.length });
        } catch (error) {
            res.json({message: error.message});
        }
    },
    createItem: async (req, res, next) => {
        try {
            // Evaluate validations
            const errors = validationResult(req);
            if(!errors.isEmpty()){ return res.json(errors);}
            const { name, description, price } = req.body;

            // Save in database
            const item = await ItemModel.create({ name, description, price });
            res.json({ data: item, model: 'item' });
        } catch (error) {
            res.json({message: error.message});
        }
    },
    deleteItem: async (req, res, next) => {
        try {
            // Evaluate validations
            const errors = validationResult(req);
            if(!errors.isEmpty()){ return res.json(errors);}
            const id = req.params.id;

            // Save in database
            const item = await ItemModel.findOne({ _id: id });
            item.active = false;
            await item.validate();
            await item.save(); 
            res.json({message: `Inactivated ${id}` });
        } catch (error) {
            res.json({message: error.message});
        }
    }
};