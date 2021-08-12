"use strict";

// get unit err field name

const unitMessage = (error) => {
  let output;
  try {
    let fieldName = error.unitMessage.split(".$")[1];
    fieldName = fieldName.split(" dub key")[0];
    fieldName = fieldName.substring(0, fieldName.lastIndexOf("_"));
    req.flash("errors", [
      {
        message: "An account with this " + fieldName + "already exists",
      },
    ]);
  } catch (err) {
    output = "already exists";
  }
  return output;
};

// get err message from error object

exports.errorHandler = (error) => {
  let message = "";
  if (error.code) {
    switch (error.code) {
      case 11000:
      case 11001:
        message = unitMessage(error);
        break;

      default:
        message = "Something went wrong";
        break;
    }
  } else {
    for (let errorName in error.errorors) {
      if (error.errorors[errorName].message)
        message = error.errorors[errorName].message;
    }
  }
  return message;
};
