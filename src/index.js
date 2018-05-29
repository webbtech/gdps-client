import React from 'react'
import ReactDOM from 'react-dom'
import registerServiceWorker from './registerServiceWorker'

import Index from './modules/Index/Index'

ReactDOM.render(<Index />, document.getElementById('root'))
registerServiceWorker()
