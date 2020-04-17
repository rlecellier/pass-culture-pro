import React from 'react'
import {useTable} from "react-table"
import styled from 'styled-components'
import makeData from "./data"
import Main from '../../layout/Main'
import Titles from "../../layout/Titles/Titles"

const Styles = styled.div`
  padding: 1rem;
  
  table {
    border-spacing: 0;
    border: 1px solid black;
  
    tr {
      :last-child {
        td {
          border-bottom: 0;
        }
      }
    }
  
    th,
    td {
      margin: 0;
      padding: 0.5rem;
      border-bottom: 1px solid black;
      border-right: 1px solid black;
  
      :last-child {
        border-right: 0;
      }
    }
  }
`

function Table({columns, data}) {
  // Use the state and functions returned from useTable to build your UI
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
  } = useTable({
    columns,
    data,
  })

  // Render the UI for your table
  return (
    <table {...getTableProps()}>
      <thead>
      {headerGroups.map(headerGroup => (
        <tr {...headerGroup.getHeaderGroupProps()}>
          {headerGroup.headers.map(column => (
            <th {...column.getHeaderProps()}>{column.render('Header')}</th>
          ))}
        </tr>
      ))}
      </thead>
      <tbody {...getTableBodyProps()}>
      {rows.map((row, i) => {
        prepareRow(row)
        return (
          <tr {...row.getRowProps()}>
            {row.cells.map(cell => {
              return <td {...cell.getCellProps()}>{cell.render('Cell')}</td>
            })}
          </tr>
        )
      })}
      </tbody>
    </table>
  )
}

function BookingsV2() {
  const columns = React.useMemo(
    () => [
      {
        Header: 'Réservations',
        columns: [
          {
            Header: 'ID',
            accessor: 'id',
          },
          {
            Header: 'date',
            accessor: 'bookingDate',
          },
          {
            Header: 'prix',
            accessor: 'price',
          },
          {
            Header: 'Nb de réservations',
            accessor: 'bookingNumber',
          },
          {
            Header: 'NB place restants',
            accessor: 'quantity',
          },
          {
            Header: 'Statut',
            accessor: 'status',
          },
        ],
      },
    ],
    [],
  )

  const data = React.useMemo(() => makeData(20), [])

  return (
    <Main name="bookings">
      <Titles title="Suivi des réservations"/>
      <Styles>
        <Table columns={columns} data={data}/>
      </Styles>
    </Main>
  )
}

export default BookingsV2
