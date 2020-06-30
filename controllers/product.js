const formidable = require('formidable');
const _ = require('lodash');
const fs = require('fs')
const Product = require("../models/product");
const { errorHandler } = require("../helpers/dbErrorHandler");


exports.productById = (req, res, next, id) => {
    Product.findById(id).exec((err, product) => {
        if (err) {
            return res.status(400).json({
                error: errorHandler(err)
            })
        }
        req.product = product;
        next();
    })
}

exports.read = (req, res) => {
    req.product.photo = undefined

    return res.json(req.product)
}

exports.create = (req, res) => {

    let form = new formidable.IncomingForm();
    form.keepExtensions = true;
    form.parse(req, (err, fields, files) => {
        if (err) {
            return res.status(400).json({
                error: 'Image couldnot be uploaded'
            })
        }

        // check for all fields
        const { name, description, price, category, quantity, shipping } = fields;

        if (!name || !description || !price || !category || !quantity || !shipping) {
            return res.status(400).json({
                error: ' All fields are required'
            })
        }


        let product = new Product(fields);

        // 1kb ==1000
        //1mb = 1000000


        if (files.photo) {
            //  console.log("Files Photo", files)

            if (files.photo.size > 1000000) {
                return res.status(400).json({
                    error: ' Image should e less than 1mb in size'
                })
            }

            product.photo.data = fs.readFileSync(files.photo.path);
            product.photo.contentType = files.photo.type;
        }


        product.save((err, result) => {
            if (err) {
                return res.status(400).json({
                    error: errorHandler(err)
                });
            }

            res.json(result);
        })
    })

}
exports.remove = (req, res) => {
    let product = req.product
    product.remove((err, deleteProduct) => {
        if(err){
            return res.status(400).json({
                error: errorHandler(err)
            })
        }
        res.json({
            message: 'product deleted succfully'
        })
    })
}

exports.update = (req, res) => {

    let form = new formidable.IncomingForm();
    form.keepExtensions = true;
    form.parse(req, (err, fields, files) => {
        if (err) {
            return res.status(400).json({
                error: 'Image couldnot be uploaded'
            })
        }

        // check for all fields
        const { name, description, price, category, quantity, shipping } = fields;

        if (!name || !description || !price || !category || !quantity || !shipping) {
            return res.status(400).json({
                error: ' All fields are required'
            })
        }


        let product = req.product;
   product = _.extend(product, fields)
        // 1kb ==1000
        //1mb = 1000000


        if (files.photo) {
            //  console.log("Files Photo", files)

            if (files.photo.size > 1000000) {
                return res.status(400).json({
                    error: ' Image should e less than 1mb in size'
                })
            }

            product.photo.data = fs.readFileSync(files.photo.path);
            product.photo.contentType = files.photo.type;
        }


        product.save((err, result) => {
            if (err) {
                return res.status(400).json({
                    error: errorHandler(err)
                });
            }

            res.json(result);
        })
    })

}