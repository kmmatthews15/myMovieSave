const Sequelize = require('sequelize');

module.exports = function(sequelize, DataTypes){
   const Movie = sequelize.define('Movie', {
      id: {
         type: DataTypes.INTEGER,
         autoIncrement: true, 
         primaryKey: true, 
         allowNull: false
      },
      movie_name: {
         type: DataTypes.STRING(100),
         allowNull: false, 
         validate: {
            len: [1, 140]
         }
      },
      api_id: {
         type: DataTypes.STRING(100),
         allowNull: false
      },
      movie_poster: {
         type: DataTypes.TEXT,
         allowNull: false
      }
   });
   return Movie;
}