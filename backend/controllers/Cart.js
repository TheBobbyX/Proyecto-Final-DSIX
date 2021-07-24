const { body, param, validationResult } = require('express-validator');

const { CartModel } = require('../models/Cart');
const { ItemModel } = require('../models/Item');


module.exports.validators = {
    getCart: [],
    addItemToCart: [
        body('id', 'Id is required').exists(),
    ],
    deleteItemFromCart: [
        param('id', 'Id is required').exists(),
    ]
};

module.exports.controllers = {
    getCart: async (req, res, next) => {
        try {
            // Evaluate validations
            const errors = validationResult(req);
            if(!errors.isEmpty()){ return res.json(errors);}

            // Save in database
            const cart = await CartModel.find(); 
            res.json({ data: cart, model: 'cart', count: cart.length });
        } catch (error) {
            res.json({message: error.message});
        }
    },
    addItemToCart: async (req, res, next) => {
        try {
            // Evaluate validations
            const errors = validationResult(req);
            if(!errors.isEmpty()){ return res.json(errors);}
            const { id } = req.body;

            // Save in database
            const item = await ItemModel.findById(id);
            await CartModel.create({ item });
            const cart = await CartModel.find(); 
            res.json({ data: cart, model: 'cart', count: cart.length });
        } catch (error) {
            res.json({message: error.message});
        }
    },
    deleteItemFromCart: async (req, res, next) => {
        try {
            // Evaluate validations
            const errors = validationResult(req);
            if(!errors.isEmpty()){ return res.json(errors);}
            const  id  = req.params.id;

            // Save in database
            
            await CartModel.deleteOne({ _id: id });
            const cart = await CartModel.find(); 
            res.json({ data: cart, model: 'cart', count: cart.length });
        } catch (error) {
            res.json({message: error.message});
        }
    },
    
};