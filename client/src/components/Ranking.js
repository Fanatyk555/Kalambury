import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

const Ranking = (props) => {
    return(
        <>
            <h3>Ranking</h3>
            <div className="ranking text-dark">
            <table className="table table-sm">
                <thead>
                <tr>
                    <th scope="col">#</th>
                    <th scope="col">Nick</th>
                    <th scope="col">Points</th>
                </tr>
                </thead>
                <tbody>
                <tr>
                <th scope="row">1</th>
                <td>Mark</td>
                <td>7</td>
                </tr>
                <tr>
                <th scope="row">2</th>
                <td>Jacob</td>
                <td>3</td>
                </tr>
                </tbody>
            </table>
            </div>
        </>
    )
}

export default Ranking;