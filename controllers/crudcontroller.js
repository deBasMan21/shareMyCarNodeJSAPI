const User = require('../src/User');
const Ride = require('../src/Ride');
const Car = require('../src/Car');


class CrudController {
    constructor(model) {
        this.model = model;
    }

    update = async (req, res, next) => {
        const doc = await this.model.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.send(doc);
    }

    delete = async (req, res, next) => {
        const entity = await this.model.findById(req.params.id);
        await entity.delete();
        res.status(204).send(entity);
    }

    getAll = async (req, res, next) => {
        const entities = await this.model.find();
        res.send(entities);
    }

    getById = async (req, res, next) => {
        const entity = await this.model.findById({ _id: req.params.id });
        res.send(entity);
    }

}


module.exports = CrudController;