import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

const Ranking = (props) => {
    const user = props.usersRanking;
    const users = user.map((item, index)=>
        <tr key={index}>
            <th scope="row">{index+1}</th>
            <td>{item[0]}</td>
            <td>{item[1]}</td>    
        </tr>
    );
    return(
        <>
            <h3>Ranking</h3>
            <div className="ranking text-dark">
            <table className="table table-sm">
                <thead>
                <tr>
                    <th scope="col">#</th>
                    <th scope="col">User</th>
                    <th scope="col">Points</th>
                </tr>
                </thead>
                <tbody>
                    {users}
                </tbody>
            </table>
            </div>
        </>
    )
}

export default Ranking;