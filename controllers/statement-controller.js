const axios = require("axios");

const postStatement = (req, res, next) => {
  const sessionId = req.params.sessionId;
  const { code, kind } = req.body;
  axios({
    url: `${process.env.LIVY_SERVER}/sessions/${sessionId}/statements`,
    method: "post",
    headers: {
      "X-Requested-By": "user1",
      "Content-Type": "application/json",
    },
    data: {
      //   code: 'df_data = spark.sql("show tables from foodmart")',
      //   code: "df_data.show()",
      code: code,
      kind: kind,
    },
  })
    .then((response) => {
      res.json(response.data);
    })
    .catch((err) => {
      next(err);
    });
};

const getStatementData = (req, res, next) => {
  const sessionId = req.params.sessionId;
  const statementId = req.params.statementId;
  axios({
    url: `${process.env.LIVY_SERVER}/sessions/${sessionId}/statements/${statementId}`,
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

const cancelStatement = (req, res, next) => {
  const sessionId = req.params.sessionId;
  const statementId = req.params.statementId;
  axios({
    url: `${process.env.LIVY_SERVER}/sessions/${sessionId}/statements/${statementId}/cancel`,
    method: "post",
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

const getSessionStatements = (req, res, next) => {
  const sessionId = req.params.sessionId;
  axios({
    url: `${process.env.LIVY_SERVER}/sessions/${sessionId}/statements`,
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

exports.postStatement = postStatement;
exports.getStatementData = getStatementData;
exports.cancelStatement = cancelStatement;
exports.getSessionStatements = getSessionStatements;
