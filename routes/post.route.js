const express = require("express");
const route = express.Router();
const path = require("path");
const fs = require("fs");

const pathPost = path.join(__dirname, "../resources/posts.json");

route
  .route("/")
  .get((req, res) => {
    //GET →  Lấy về dữ liệu của toàn bộ POST
    fs.readFile(pathPost, (err, data) => {
      if (err) {
        res.status(500).send("Lỗi server");
      }
      const convertData = JSON.parse(data);
      res.status(200).json(convertData);
    });
  })
  .post((req, res) => {
    //POST →  Thêm mới dữ liệu về 1 Post vào trong CSDL
    fs.readFile(pathPost, (err, data) => {
      if (err) {
        res.status(500).send("lỗi server");
      }
      const convertData = JSON.parse(data);

      const findById = convertData.find(
        (item) => +item.id == +req.body.id
      );
      if (!findById) {
        const newData = {
          userId: Number(req.body.userId),
          id: Number(req.body.id),
          title: req.body.title,
          body: req.body.body,
        };
        console.log("newData", newData);
        convertData.push(newData);
        fs.writeFile(
          pathPost,
          JSON.stringify(convertData),
          (errWrite, dataWrite) => {
            if (errWrite) {
              console.log(errWrite);
            }
          }
        );
        res.status(200).json({ message: "Create POST successfully" });
      } else {
        res.status(400).json({ message: "POST already exist" });
      }
    });
  });

route
  .route("/:id")
  .get((req, res) => {
    // GET →  Lấy về dữ liệu của một POST
    const id = req.params.id;
    fs.readFile(pathPost, (err, data) => {
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
    //PUT →  Chỉnh sửa dữ liệu của 1 post
    const id = req.params.id;
    const updatedPostData = req.body;
    console.log("id_put", id);
    fs.readFile(pathPost, (err, data) => {
      if (err) {
        res.status(500).send("lỗ server");
      }
      const convertData = JSON.parse(data);
      const findIndex = convertData.findIndex(
        (user) => +user.id == +id
      );
      if (findIndex === -1) {
        res.status(404).send("Không tìm thấy");
      } else {
        const updatedPos = {
          ...convertData[findIndex],
          ...updatedPostData,
        };
        convertData[findIndex] = updatedPos;

        fs.writeFile(
          pathPost,
          JSON.stringify(convertData),
          (error, result) => {
            if (error) {
              res.status(500).send("Lỗi server");
            }
          }
        );
        res.status(200).json({ message: "Update POST successfully" });
      }
    });
  })
  .delete((req, res) => {
    //DELETE	 →  Xoá dữ liệu về một Post
    const id = req.params.id;
    fs.readFile(pathPost, (err, data) => {
      if (err) {
        res.status(500).send("lỗ server");
      }
      const convertData = JSON.parse(data);
      const updateData = convertData.filter(
        (item) => +item.id !== +id
      );
      if (updateData.length == convertData.length) {
        res.status(404).json({ message: "POST not found" });
      } else {
        fs.writeFile(
          pathPost,
          JSON.stringify(updateData),
          (error, result) => {
            if (error) {
              res.status(500).send("lỗi server");
            }
          }
        );
        res.status(200).json({ message: "Delete POST successfully" });
      }
    });
  });

module.exports = route;
