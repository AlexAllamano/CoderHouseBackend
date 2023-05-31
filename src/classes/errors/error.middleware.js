import ErrorEnum from "./errors.enum.js";

export default (error, req, res, next) => {
  switch (error.code) {
    case ErrorEnum.NO_ENCONTRADO:
      res.userErrorResponse(error.name);
      break;
    default:
        res.status(200).send("Error sin controlar");
  }
};
