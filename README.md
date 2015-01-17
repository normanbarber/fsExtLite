# fsExtLite
Recursively reads the directory, reading each files extension, incrementing the total count for each file format. Using to demonstrate how to avoid throwing a v8 fatal memory allocation error.

### example of returned data object
A json file will be returned with a total count for each file format.
```json
[{"name":".js","count":4},{"name":".css","count":7},{"name":".md","count":12},{"name":".jade","count":17}]
```

### Running from the server
##### npm install the package
```javascript
	> npm link
```