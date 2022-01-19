import { Sequelize } from 'sequelize'

const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: './sqlite/bugsManagement.db',
})

sequelize
  .sync()
  .then(() => {
    console.log('All models were syncronized successfully')
  })
  .catch((e) => console.log(e))

export default sequelize
