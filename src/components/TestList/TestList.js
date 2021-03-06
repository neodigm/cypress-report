import React from 'react';
import './TestList.css';
import AutoScroll from "../AutoScroll";

const TestList = (props) => {
    const {spec, specName} = props;

    const getTestListForSpec = (spec, tests = []) => {
        if (spec.tests && spec.tests.length > 0) tests = [...tests, spec.tests.map(test => ({
            title: test.fullTitle,
            passed: test.passed,
            message: test.message
        }))]

        const suites = Object.keys(spec).filter(key => !["tests", "pass", "fail", "total", "title", "fullTitle"].includes(key));
        if (suites.length > 0) {
            suites.forEach(suite => {
                const testsForSuite = getTestListForSpec(spec[suite]);
                tests = [...tests, ...testsForSuite];
            })
        }

        return tests.flat();
    }

    const onEnd = () => {
        if(props.onEnd) props.onEnd();
    }

    return (
        <div className='TestList'>
            <div
                className={['TestList__Spec', spec.fail > 0 ? 'error' : ''].join(" ")}>
                <div className={'TestList__Spec__Header'}>
                    <div>{specName}</div>
                    <div>Passed: {spec.pass}/{spec.total}</div>
                </div>
                <AutoScroll onEnd={onEnd} data={spec}>
                    <ul className='TestList__Spec__TestList'>
                        {getTestListForSpec(spec).map(
                            (test, index) => (
                                <li key={`suite-${index}-${test.title}`}
                                    className={['TestList__Spec__TestList__Test', test.passed ? '' : 'error'].join(" ")}>
                                <span className={["material-icons", test.passed ? '' : 'error'].join(' ')}>
                                    {test.passed ? 'check' : 'close'}
                                    </span>
                                    {test.title} {test.message ? `- ${test.message}` : ''}
                                </li>)
                        )}
                    </ul>
                </AutoScroll>
            </div>
        </div>
    )
}

export default TestList;