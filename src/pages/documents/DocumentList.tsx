import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { getDocuments } from '../../services/documentService'
import { Stack, Typography, Button, Table, TableHead, TableRow, TableCell, TableBody, Pagination, Chip, CircularProgress, Box } from '@mui/material'
import { Link, useNavigate } from 'react-router-dom'

export default function DocumentList() {
  const navigate = useNavigate()
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
            <TableCell>Date</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {isLoading ? (
            <TableRow><TableCell colSpan={4}><Box sx={{ display: 'flex', justifyContent: 'center', py: 3 }}><CircularProgress size={40} /></Box></TableCell></TableRow>
          ) : items.length === 0 ? (
            <TableRow><TableCell colSpan={4}>No documents</TableCell></TableRow>
          ) : (
            items.map((d: any) => (
              <TableRow 
                key={d.id} 
                hover 
                onClick={() => navigate(`/documents/${d.id}`)}
                sx={{ cursor: 'pointer' }}
              >
                <TableCell>{d.fileName || d.originalName}</TableCell>
                <TableCell><Chip label={d.documentType || d.category} size="small" /></TableCell>
                <TableCell>
                  {d.patient?.user ? `${d.patient.user.firstName} ${d.patient.user.lastName}` :
                   d.patient?.firstName ? `${d.patient.firstName} ${d.patient.lastName}` : 'N/A'}
                </TableCell>
                <TableCell>{d.createdAt ? new Date(d.createdAt).toLocaleDateString() : '-'}</TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
      <Pagination count={totalPages} page={page} onChange={(_, v) => setPage(v)} />
    </Stack>
  )
}