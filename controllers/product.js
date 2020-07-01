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
        if (err) {
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

};


/**
 * * sell/ arrival
 * 
 * */

exports.list = (req, res) => {
    const order = req.query.order ? req.query.order : 'asc';
    const sortBy = req.query.SortBy ? req.query.sortBy : '_id';
    const limit = req.query.limit ? parseInt(req.query.limit) : 6;

    Product.find().select("-photo").populate('category').sort([[sortBy, order]]).limit(limit)
        .exec((err, products) => {
            if (err) {
                return res.status(400).json({
                    error: ' Product not found'
                })
            }
            res.json(products)
        })
}



/**
 *  it will find the products based on the req product category
 * 
 * other products that has same category will be returned
 */

exports.listRelated = (req, res) => {

    const limit = req.query.limit ? parseInt(req.query.limit) : 6;

    Product.find({ _id: { $ne: req.product }, category: req.product.category })
    .limit(limit)
    .populate('category', '_id name')
    .exec((err, products) => {
        if (err) {
            return res.status(400).json({
                error: ' Product not found'
            })
        }
        res.json(products)

 })
}