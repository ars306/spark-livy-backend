const axios = require("axios");
const Session = require("../models/session");

// get sessions from livy
const getSessions = async (req, res, next) => {
  const { from, size } = req.body;
  try {
    const response = await axios({
      url: `${process.env.LIVY_SERVER}/sessions`,
      method: "get",
      headers: {
        "X-Requested-By": "user1",
        "Content-Type": "application/json",
      },
      data: {
        from: from,
        size: size,
      },
    });
    res.json(response.data);
  } catch (err) {
    next(err);
  }
};

// post new session in livy
const postSession = (req, res, next) => {
  const {
    name,
    // kind,
    executorMemory,
    executorCores,
    numExecutors,
    driverMemory,
    queue,
    jars,
    pyFiles,
    proxyUser,
  } = req.body;
  axios({
    url: `${process.env.LIVY_SERVER}/sessions`,
    method: "post",
    headers: {
      "X-Requested-By": "user1",
      "Content-Type": "application/json",
    },
    data: {
      //   name: "my-session",
      //   kind: "pyspark",
      //   executorMemory: "900M",
      //   executorCores: 1,
      //   numExecutors: 1,
      //   //   driverMemory: "1G",
      name: name,
      //   kind: kind || "sql",
      executorMemory: executorMemory,
      executorCores: executorCores,
      numExecutors: numExecutors,
      driverMemory: driverMemory,
      queue: queue,
      jars: jars,
      pyFiles: pyFiles,
      proxyUser: proxyUser,
      //   jars: [
      //     "local:/usr/hdp/current/hive_warehouse_connector/hive-warehouse-connector-assembly-1.0.0.3.0.1.0-187.jar",
      //   ],
      //   pyFiles: [
      //     "local:/usr/hdp/current/hive_warehouse_connector/pyspark_hwc-1.0.0.3.0.1.0-187.zip",
      //   ],
    },
  })
    .then((response) => {
      // update session id in db
      const createdSession = new Session({
        createdby: req.userData.userId,
        sessionId: response.data.id,
      });
      createdSession
        .save()
        .then(res.json(response.data))
        .catch((err) => {
          next(err);
        });
    })
    .catch((err) => {
      // console.log(err);
      next(err);
    });

  // save session info in DB
};

// delete session from livy
const deleteSession = (req, res, next) => {
  const sessionId = req.params.sessionId;
  let sessionDeleted = null;
  Session.deleteOne({ sessionId: sessionId })
    .then((sessionDeleted = true))
    .catch(() => {
      next(err);
    });

  if (sessionDeleted) {
    axios({
      url: `${process.env.LIVY_SERVER}/sessions/${sessionId}`,
      method: "delete",
      headers: {
        "X-Requested-By": "user1",
        "Content-Type": "application/json",
      },
    })
      .then((response) => {
        res.json(response.data);
      })
      .catch((err) => {
        next(err);
      });
  }
};

// get seesion info
const getSessionById = (req, res, next) => {
  const sessionId = req.params.sessionId;
  axios({
    url: `${process.env.LIVY_SERVER}/sessions/${sessionId}`,
    method: "get",
    headers: {
      "X-Requested-By": "user1",
      "Content-Type": "application/json",
    },
  })
    .then((response) => {
      res.json(response.data);
    })
    .catch((err) => {
      next(err);
    });
};

// get session state
const getSessionState = (req, res, next) => {
  const sessionId = req.params.sessionId;
  axios({
    url: `${process.env.LIVY_SERVER}/sessions/${sessionId}/state`,
    method: "get",
    headers: {
      "X-Requested-By": "user1",
      "Content-Type": "application/json",
    },
  })
    .then((response) => {
      res.json(response.data);
    })
    .catch((err) => {
      next(err);
    });
};

// get session log
const getSessionLog = (req, res, next) => {
  const { from, size } = req.body;
  const sessionId = req.params.sessionId;
  axios({
    url: `${process.env.LIVY_SERVER}/sessions/${sessionId}/log`,
    method: "get",
    headers: {
      "X-Requested-By": "user1",
      "Content-Type": "application/json",
    },
    data: {
      from: from,
      size: size,
    },
  })
    .then((response) => {
      res.json(response.data);
    })
    .catch((err) => {
      next(err);
    });
};

const getUserSession = async (req, res, next) => {
  let sid;
  try {
    // console.log(req.userData.userId);
    sid = await Session.findOne({ createdby: req.userData.userId });
  } catch (err) {
    // console.log(err);
    return next(err);
  }

  if (!sid) {
    error = "Could not find session for this user";
    return next(error);
  }
  // console.log(sessionId.toObject({ getters: true }).sessionId);
  res.json({ sid: sid.toObject({ getters: true }) });
};

exports.getSessions = getSessions;
exports.getSessionById = getSessionById;
exports.getSessionState = getSessionState;
exports.getSessionLog = getSessionLog;
exports.postSession = postSession;
exports.deleteSession = deleteSession;
exports.getUserSession = getUserSession;

// const getSessions = (req, res, next) => {
//   axios({
//     url: `${process.env.LIVY_SERVER}/sessions`,
//     method: "get",
//     headers: {
//       "X-Requested-By": "user1",
//       "Content-Type": "application/json",
//     },
//   })
//     .then((response) => {
//       res.json(response.data);
//     })
//     .catch((err) => {
//       next(err);
//     });
// };
