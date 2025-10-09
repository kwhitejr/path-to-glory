# Clear Development Data

**IMPORTANT**: Multiple breaking changes have been made to the unit data structure:
1. Enhancements and path abilities changed from arrays to single strings
2. Unit structure now includes rank, renown, reinforced, enhancement, pathAbility fields
3. Faction data now includes enhancements and path abilities loaded from JSON

To clear old data, open the browser console and run:

```javascript
localStorage.clear();
```

Then refresh the page and create new armies with the updated structure.

This file can be deleted after clearing localStorage.
