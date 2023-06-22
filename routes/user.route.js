const express = require("express");
const route = express.Router();
const path = require("path");
const fs = require("fs");

const pathUser = path.join(__dirname, "../resources/users.json");

route
  .route("/")
  .get((req, res) => {
    //GET →  Lấy về dữ liệu của toàn bộ users
    fs.readFile(pathUser, (err, data) => {
      if (err) {
        res.status(500).send("Lỗi server");
      }
      const convertData = JSON.parse(data);
      res.status(200).json(convertData);
    });
  })
  .post((req, res) => {
    //POST →  Thêm mới dữ liệu về 1 users vào trong CSDL
    fs.readFile(pathUser, (err, data) => {
      if (err) {
        res.status(500).send("lỗi server");
      }
      const convertData = JSON.parse(data);

      const findById = convertData.find(
        (item) => +item.id == +req.body.id
      );
      if (!findById) {
        const newData = {
          id: Number(req.body.id),
          name: req.body.name,
          username: req.body.username,
          email: req.body.email,
          address: {
            street: req.body.address.street,
            suite: req.body.address.suite,
            city: req.body.address.city,
            zipcode: req.body.address.zipcode,
            geo: {
              lat: req.body.address.geo.lat,
              lng: req.body.address.geo.lng,
            },
          },
          phone: req.body.phone,
          website: req.body.website,
          company: {
            name: req.body.company.name,
            catchPhrase: req.body.company.catchPhrase,
            bs: req.body.company.bs,
          },
        };
        console.log("newData", newData);
        convertData.push(newData);
        fs.writeFile(
          pathUser,
          JSON.stringify(convertData),
          (errWrite, dataWrite) => {
            if (errWrite) {
              console.log(errWrite);
            }
          }
        );
        res.status(200).json({ message: "Create successfully" });
      } else {
        res.status(400).json({ message: "Question already exist" });
      }
    });
  });

route
  .route("/:id")
  .get((req, res) => {
    // GET →  Lấy về dữ liệu của một user
    const id = req.params.id;
    fs.readFile(pathUser, (err, data) => {
      if (err) {
        res.status(500).send("lỗi server");
      }
      const convertData = JSON.parse(data);
      const findContent = convertData.find(
        (user) => +user.id === +id
      );
      if (!findContent) {
        res.status(404).send("Không tìm thấy");
      }
      res.status(200).json(findContent);
    });
  })
  .put((req, res) => {
    //PUT →  Chỉnh sửa dữ liệu của 1 user (email)
    const id = req.params.id;
    const updatedUserData = req.body;
    console.log("id_put", id);
    fs.readFile(pathUser, (err, data) => {
      if (err) {
        res.status(500).send("lỗ server");
      }
      const convertData = JSON.parse(data);
      const findUser = convertData.find((user) => +user.id == +id);
      if (!findUser) {
        res.status(404).send("không tìm thấy");
      } else {
        findUser.email = updatedUserData.email;
        fs.writeFile(
          pathUser,
          JSON.stringify(convertData),
          (error, result) => {
            if (error) {
              res.status(500).send("lỗi server");
            }
          }
        );
        res.status(200).json({ message: "Update successfully" });
      }
    });
  })
  .delete((req, res) => {
    //DELETE	 →  Xoá dữ liệu về một user
    const id = req.params.id;
    fs.readFile(pathUser, (err, data) => {
      if (err) {
        res.status(500).send("lỗ server");
      }
      const convertData = JSON.parse(data);
      const updateData = convertData.filter(
        (item) => +item.id !== +id
      );
      if (updateData.length == convertData.length) {
        res.status(404).json({ message: "User not found" });
      } else {
        fs.writeFile(
          pathUser,
          JSON.stringify(updateData),
          (error, result) => {
            if (error) {
              res.status(500).send("lỗi server");
            }
          }
        );
        res.status(200).json({ message: "Delete successfully" });
      }
    });
  });

module.exports = route;
