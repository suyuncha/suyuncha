/*
===================================
SAVE SYSTEM
===================================
*/

const saveButton =
  document.querySelector(
    '.save-button'
  );

const nameInput =
  document.querySelector(
    '.name-input'
  );

/*
-----------------------------------
SAVE
-----------------------------------
*/

saveButton.addEventListener(
  'click',
  () => {

    /*
      name
    */

    const name =
      nameInput.value.trim();

    if(!name) return;

    /*
      selected cubes
    */

    const pattern =
      [...selected];

    /*
      existing entries
    */

    const existing =
      JSON.parse(
        localStorage.getItem(
          'galleryEntries'
        )
      ) || [];

    /*
      new entry
    */

    const newEntry = {

      name:name,

      pattern:pattern

    };

    /*
      newest first
    */

    existing.unshift(
      newEntry
    );

    /*
      limit 20
    */

    if(existing.length > 20){

      existing.pop();

    }

    /*
      save
    */

    localStorage.setItem(
      'galleryEntries',
      JSON.stringify(existing)
    );

    /*
      reset input
    */

    nameInput.value = '';

  }
);
