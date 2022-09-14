export const getSavedMomentIds = () => {
  const savedMomentIds = localStorage.getItem("saved_moments")
    ? JSON.parse(localStorage.getItem("saved_moments"))
    : [];

  return savedMomentIds;
};

export const saveMomentIds = (momentIdArr) => {
  if (momentIdArr.length) {
    localStorage.setItem("saved_moments", JSON.stringify(momentIdArr));
  } else {
    localStorage.removeItem("saved_moments");
  }
};

export const removeMomentId = (momentId) => {
  const savedMomentIds = localStorage.getItem("saved_moments")
    ? JSON.parse(localStorage.getItem("saved_moments"))
    : null;

  if (!savedMomentIds) {
    return false;
  }

  const updatedSavedMomentIds = savedMomentIds?.filter(
    (savedMomentId) => savedMomentId !== momentId
  );
  localStorage.setItem("saved_moments", JSON.stringify(updatedSavedMomentIds));

  return true;
};
