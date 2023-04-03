const client = require('./client')

function getItem(itemId) {
    return new Promise((resolve, reject) => {
      client.getItem({ itemId }, (error, response) => {
        if (error) {
          reject(error);
        } else {
          resolve(response);
        }
      });
    });
  }
  
  
  function addItem(itemId, description, date) {
    return new Promise((resolve, reject) => {
      const item = { itemId, description, date };
      client.addItem(item, (error, response) => {
        if (error) {
          reject(error);
        } else {
          resolve(response);
        }
      });
    });
  }
  
  function updateItem(itemId, description, date) {
    return new Promise((resolve, reject) => {
      const item = { itemId, description, date };
      client.updateItem(item, (error, response) => {
        if (error) {
          reject(error);
        } else {
          resolve(response);
        }
      });
    });
  }
  
  function deleteItem(itemId) {
    return new Promise((resolve, reject) => {
      client.deleteItem({ itemId }, (error, response) => {
        if (error) {
          reject(error);
        } else {
          resolve(response);
        }
      });
    });
  }

  async function test() {
    try {
      const newUser1 = await addItem('1', 'Desc 1', '21/04/2023');
      console.log('addItem:', newUser1);
  
      const updatedUser = await updateItem(1, 'Desc 1 update', '21/04/2023');
      console.log('updateItem:', updatedUser);

      const newUser2 = await addItem('2', 'Desc 2', '19/09/1999');
      console.log('addItem:', newUser2);
  
      const result = await deleteItem(2);
      console.log('deleteItem:', result);

      const user = await getItem(1);
      console.log('getItem:', user);
    } catch (error) {
      console.error(error);
    }
  }
  
  test();