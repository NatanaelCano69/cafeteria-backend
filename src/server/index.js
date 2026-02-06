const Category = require('./Category');
const Product = require('./Product');
const Tag = require('./Tag');
const ProductTag = require('./ProductTag');

Category.hasMany(Product, {
    foreignKey: 'category_id'
});

Product.belongsTo(Category, {
    foreignKey: 'category_id'
});

Product.belongsToMany(Tag, {
    through: ProductTag
});

Tag.belongsToMany(Product, {
    through: ProductTag
});

module.exports = { Category, Product, Tag, ProductTag };