const express = require("express");
const usersList = require("./usersData");

const app = express();
const port = 3001;

app.use(express.json());

// app.get('/', (req, res) => {
//     res.send('Hello World!');
// });

// Read all users
app.get("/all-users", (req, res) => {
  res.status(200).json({ data: usersList });
});

app.get("/single-user/:phoneNumber", (req, res) => {
  const phoneNumber = req.params.phoneNumber;

  const user = usersList.find((user) => user.phone === phoneNumber);

  if (user) {
    res.json(user);
  } else {
    res.status(404).send("User not found");
  }
});

app.get('/some-users/:countryName', (req, res) => {
    const countryName = req.params.countryName;

    const users = usersList.filter(user => user.location.country.toLowerCase() === countryName.toLowerCase());

    if (users.length > 0) {
        res.json(users);
    } else {
        res.status(404).send('No users found from this country');
    }
});



// Create a new user
app.post("/new-user", (req, res) => {
    const newUser = {
      gender: req.body.gender,
      name: {
        title: req.body.name.title,
        first: req.body.name.first,
        last: req.body.name.last,
      },
      location: {
        city: req.body.location.city,
        state: req.body.location.state,
        country: req.body.location.country,
        postcode: req.body.location.postcode,
      },
      email: req.body.email,
      phone: req.body.phone,
      cell: req.body.cell,
      nat: req.body.nat,
    };
  
    usersList.push(newUser);
  
    res.status(201).json(newUser);
  });
  

// Update a user

app.put('/update-user/:email', (req, res) => {
    const email = req.params.email;

    const index = usersList.findIndex(user => user.email === email);

    if (index !== -1) {
        const originalUser = usersList[index];

        const updatedUser = {
            gender: req.body.gender || originalUser.gender,
            name: {
                title: req.body.name?.title || originalUser.name.title,
                first: req.body.name?.first || originalUser.name.first,
                last: req.body.name?.last || originalUser.name.last,
            },
            location: {
                city: req.body.location?.city || originalUser.location.city,
                state: req.body.location?.state || originalUser.location.state,
                country: req.body.location?.country || originalUser.location.country,
                postcode: req.body.location?.postcode || originalUser.location.postcode,
            },
            email: req.body.email || originalUser.email,
            phone: req.body.phone || originalUser.phone,
            cell: req.body.cell || originalUser.cell,
            nat: req.body.nat || originalUser.nat,
        };

        usersList[index] = updatedUser;

        res.json({ success: true });
    } else {
        res.status(404).send('User not found');
    }
});


// Delete a user
app.delete('/delete-user/:cellNumber', (req, res) => {
    const cellNumber = req.params.cellNumber;

    const index = usersList.findIndex(user => user.cell === cellNumber);

    if (index !== -1) {
        usersList.splice(index, 1);
        res.json({ success: true });
    } else {
        res.status(404).send('User not found');
    }
});


app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
