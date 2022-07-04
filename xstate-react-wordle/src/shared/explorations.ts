const switchboard = `
  in -> KEYPRESS -> keypressHandler
  in -> TOGGLE_DARK_MODE as TOGGLE -> darkMode
  in -> OPEN_DIALOG as CHANGE_ACTIVE_VAL -> dialogs
  in -> CLOSE_DIALOG as CHANGE_ACTIVE_VAL -> dialogs

  keypressHandler -> * -> out
  }
`;

const switchboard = `
  in
    KEYPRESS -> keypressHandler
    TOGGLE_DARK_MODE as TOGGLE -> darkMode
    OPEN_DIALOG as CHANGE_ACTIVE_VAL -> dialogs
    CLOSE_DIALOG as CHANGE_ACTIVE_VAL -> dialogs

    OPEN_DIALOG
      -> system
      as CHANGE_ACTIVE_VAL -> dialogs
      -> out
      
  @component ${keypressHandler}  
  keypressHandler
    
    * -> out
  }
`;

const switchboard = `
  in
    TOGGLE_HARD_MODE as TOGGLE -> darkMode
    ADD_LETTER -> gameStatus
    DELETE_LETTER -> gameStatus
    SUBMIT_GUESS -> validateGuess

  @component ${validateGuess}  
  validateGuess
    VALID_GUESS -> out
    INVALID_GUESS -> out
  }
`;

const switchboard = `
  in
    -> gameStatus
      ADD_LETTER
      DELETE_LETTER
    
    -> darkMode
      TOGGLE_DARK_MODE as TOGGLE

    -> validateGuess
      SUBMIT_GUESS


  @component ${validateGuess}  
  validateGuess
    -> out
      *
    VALID_GUESS -> out
    INVALID_GUESS -> out
  }
`;
