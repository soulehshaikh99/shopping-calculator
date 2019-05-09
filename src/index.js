import React from 'react';
import ReactDOM from 'react-dom';

import 'typeface-roboto';
import './styles/index.css';
import * as serviceWorker from './serviceWorker';
import EntireLayout from './components/EntireLayout';

const App = () => {
    return (
        <div id="App">
            <EntireLayout />
        </div>
    );
};

ReactDOM.render(<App />, document.getElementById('root'));

serviceWorker.register();