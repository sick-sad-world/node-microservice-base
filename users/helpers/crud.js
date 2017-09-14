const { result, pick, assign } = require('lodash');

class Crud {

  static sendData(target) {
    return (req, res, next) => {
      res.json(result(req, target))
    }
  }

  static writeData(req, next, Model) {
    return (data) => {
      req[Model.modelName] = Model.toJSON(data);
      next();
    }
  }

  static readAll (Model, query) {
    return (req, res, next) => {
      Model
        .find(result(req, query))
        .lean()
        .exec()
        .then(this.writeData(req, next, Model))
        .catch(err => next(err))
    }
  }

  static readOne (Model) {
    return (req, res, next) => {
      if (!req.params.id) {
        next({status: 500, message: 'Please provide id to retrieve something'});
      } else {
        Model
          .findById(req.params.id)
          .lean()
          .exec()
          .then(data => (!data) ? next(`${Model.name} with id: ${req.params.id} not found`) : data )
          .then((this.writeData(req, next, Model)))
          .catch(err => next(err));
      }
    }
  }

  static createOne (Model, props) {
    return (req, res, next) => {
      Model
        .create(pick(req.body, props))
        .then(this.writeData(req, next, Model))
        .catch(err => next(err));
    }
  }

  static modifyItem(Model) {
    return (req, res, next) => {
      if (!req.params.id) {
        next({status: 500, message: 'Please provide id to edit something'});
      } else {
        let id = (req.params.id && req.user.role === 'admin') ? req.params.id : req.user.id;
        Model
          .findById(id)
          .then(model => assign(model, req.body).save())
          .then(this.writeData(req, next, Model))
          .catch(err => next(err));
      }
    }
  }

  static deleteOne (Model) {
    return (req, res, next) => {
      if (!req.params.id) {
        next({status: 500, message: 'Please provide id to delete something'});
      } else {
        let id = (req.params.id && req.user.role === 'admin') ? req.params.id : req.user.id;
        Model
          .findByIdAndRemove(id)
          .then((model) => {
            req[Model.modelName] = { message: `Document id:${id} successfully deleted.` }
            next();
          })
          .catch(err => next(err));
      }
    }
  }
}
module.exports = Crud;