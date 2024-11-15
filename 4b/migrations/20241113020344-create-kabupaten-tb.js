'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('kabupaten_tbs', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      kabupaten_name: {
        type: Sequelize.STRING
      },
      provinsi_id: {
        type: Sequelize.INTEGER,
         references: {
          model:"provinsi_tb",
          key:"id"

        }
      },
      inaugurated: {
        type: Sequelize.DATE
      },
      image: {
        type: Sequelize.STRING
      },
      author_id: {
        type: Sequelize.INTEGER,
        references: {
          model:"provinsi_tb",
          key:"id"

        }
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('kabupaten_tbs');
  }
};