import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { getDocuments } from '../../services/documentService'
import { Stack, Typography, Button, Table, TableHead, TableRow, TableCell, TableBody, Pagination } from '@mui/material'
import { Link } from 'react-router-dom'

export default function DocumentList() {
  const [page, setPage] = useState(1)
  const { data, isLoading } = useQuery({ queryKey: ['documents', page], queryFn: () => getDocuments({ page, limit: 10 }) })
  const items = data?.items ?? []
  const totalPages = data?.pagination?.pages ?? 1
  return (
    <Stack gap={2}>
      <Typography variant="h5">Documents</Typography>
      <Button variant="contained" component={Link} to="/documents/upload">Upload Document</Button>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Name</TableCell>
            <TableCell>Type</TableCell>
            <TableCell>Patient</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {isLoading ? (
            <TableRow><TableCell colSpan={3}>Loading...</TableCell></TableRow>
          ) : items.length === 0 ? (
            <TableRow><TableCell colSpan={3}>No documents</TableCell></TableRow>
          ) : (
            items.map(d => (
              <TableRow key={d.id} hover component={Link} to={`/documents/${d.id}`} style={{ textDecoration: 'none' }}>
                <TableCell>{d.fileName}</TableCell>
                <TableCell>{d.documentType}</TableCell>
                <TableCell>{d.patientId}</TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
      <Pagination count={totalPages} page={page} onChange={(_, v) => setPage(v)} />
    </Stack>
  )
}