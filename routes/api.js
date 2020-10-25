/*
 *
 *
 *       Complete the API routing below
 *
 *
 */

"use strict";

var expect = require("chai").expect;
const bodyParser = require("body-parser");
var shortid = require("shortid");

var boardsDB = {};

module.exports = function (app) {
  app
    .route("/api/threads/:board")
    .get((req, res) => {
      const { board } = req.params;
      console.log(board);

      const mostRecent = boardsDB[board].threads
        .sort((a, b) => b - a)
        .slice(0, 10)
        .map((t) => ({
          ...t,
          replycount: t.replies.length,
          delete_password: undefined,
          reported: undefined,
        }));

      res.json(mostRecent);
    })
    .post((req, res) => {
      console.log("post");
      const { board } = req.params;
      const { text, delete_password } = req.body;
      let newThread = {
        _id: shortid.generate(),
        text,
        created_on: new Date(),
        bumped_on: new Date(),
        reported: false,
        delete_password,
        replies: [],
      };

      if (!boardsDB[board]) {
        boardsDB[board] = {
          threads: [newThread],
        };
      } else {
        boardsDB[board].threads.push(newThread);
      }
      console.log(newThread);
      console.log(boardsDB);
      res.redirect(`/b/${board}/`);
    })
    .put((req, res) => {
      const { board } = req.params;
      const { thread_id } = req.body;

      boardsDB[board].threads = boardsDB[board].threads.map((thread) => {
        if (thread._id === thread_id) {
          return {
            ...thread,
            reported: true,
          };
        }

        return thread;
      });
      res.send("Success");
    })
    .delete((req, res) => {
      const { board } = req.params;
      const { thread_id, delete_password } = req.body;

      let findThread = boardsDB[board].threads.find(
        (thread) => thread_id === thread_id
      );
      console.log(delete_password, findThread.delete_password, thread_id);
      if (delete_password === findThread.delete_password) {
        boardsDB[board].threads = boardsDB[board].threads.filter(
          (thread) => thread._id !== thread_id
        );
        res.send("Success");
      } else {
        res.send("Incorrect Password");
      }
    });

  app
    .route("/api/replies/:board")
    .get((req, res) => {
      const { board } = req.params;
      const { thread_id } = req.query;

      let thread = boardsDB[board].threads.find(
        (thread) => thread._id === thread_id
      );

      res.json({
        ...thread,
        delete_password: undefined,
        reported: undefined,
      });
    })
    .post((req, res) => {
      console.log("post");
      const { board } = req.params;
      const { text, delete_password, thread_id } = req.body;

      boardsDB[board].threads = boardsDB[board].threads.map((thread) => {
        if (thread._id === thread_id) {
          let newReply = {
            _id: shortid.generate(),
            text,
            created_on: new Date(),
            reported: false,
            delete_password,
          };
          return {
            ...thread,
            replies: [...thread.replies, newReply],
          };
        }
        return thread;
      });

      res.redirect(`/b/${board}/${thread_id}`);
    })
    .put((req, res) => {
      const { board } = req.params;
      const { thread_id, reply_id } = req.body;

      boardsDB[board].threads = boardsDB[board].threads.map((thread) => {
        if (thread._id === thread_id) {
          return {
            ...thread,
            replies: thread.replies.map((reply) => {
              if (reply._id === reply_id) {
                return {
                  ...reply,
                  reported: true,
                };
              }
              return reply;
            }),
          };
        }

        return thread;
      });
      res.send("Success");
    })
    .delete((req, res) => {
      const { board } = req.params;
      const { thread_id, reply_id, delete_password } = req.body;

      let findThread = boardsDB[board].threads.find(
        (thread) => thread_id === thread_id
      );
      let findReply = findThread.replies.find(
        (reply) => reply._id === reply_id
      );

      if (delete_password === findReply.delete_password) {
        boardsDB[board].threads = boardsDB[board].threads.map((thread) => {
          if (thread._id === thread_id) {
            return {
              ...thread,
              replies: thread.replies.map((reply) => {
                if (reply._id === reply_id) {
                  return {
                    ...reply,
                    text: "[deleted]",
                  };
                }
                return reply;
              }),
            };
          }
          return thread_id;
        });
        res.send("Success");
      } else {
        res.send("Incorrect Password");
      }
    });
};
