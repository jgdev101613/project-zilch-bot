module.exports = (existingCommand, localCommand) => {
  function areChoicesDifferent(existingChoices = [], localChoices = []) {
    if (existingChoices.length !== localChoices.length) {
      return true;
    }

    for (const localChoice of localChoices) {
      const existingChoice = existingChoices.find(
        (choice) => choice.name === localChoice.name,
      );

      if (!existingChoice) {
        return true;
      }

      if (
        existingChoice.value !== localChoice.value ||
        existingChoice.name !== localChoice.name
      ) {
        return true;
      }
    }

    return false;
  }

  function areOptionsDifferent(existingOptions = [], localOptions = []) {
    if (existingOptions.length !== localOptions.length) {
      return true;
    }

    for (const localOption of localOptions) {
      const existingOption = existingOptions.find(
        (option) => option.name === localOption.name,
      );

      if (!existingOption) {
        return true;
      }

      if (
        existingOption.name !== localOption.name ||
        existingOption.description !== localOption.description ||
        existingOption.type !== localOption.type ||
        (existingOption.required ?? false) !== (localOption.required ?? false)
      ) {
        return true;
      }

      // Compare choices recursively
      if (
        areChoicesDifferent(
          existingOption.choices || [],
          localOption.choices || [],
        )
      ) {
        return true;
      }

      // Compare nested options recursively
      if (
        areOptionsDifferent(
          existingOption.options || [],
          localOption.options || [],
        )
      ) {
        return true;
      }
    }

    return false;
  }

  return (
    existingCommand.description !== localCommand.description ||
    areOptionsDifferent(
      existingCommand.options || [],
      localCommand.options || [],
    )
  );
};
