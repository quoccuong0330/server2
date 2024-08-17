const format = (date_string) => {
  const date_obj = new Date(date_string);
  const options = {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    timeZoneName: 'short'
  };

  return date_obj.toLocaleDateString('en-GB', options);
};

module.exports = { format };
