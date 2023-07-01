module.exports = (sequelize, DataTypes) => {

    const Product = sequelize.define("Product", {
        name: {
            type: DataTypes.STRING,
            allowNull: false
        },
        quantity: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        price: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
    }) 

    Product.associate = models => {
        Product.belongsTo(models.User, {
            foreignKey : {
                allowNull : false
            }
        }  )
    }

    return Product
   
}