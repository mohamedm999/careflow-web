import { Box, Paper, Typography, Switch, List, ListItem, ListItemText, ListItemSecondaryAction, Divider } from '@mui/material'

export default function Settings() {
    return (
        <Box maxWidth="md" mx="auto">
            <Typography variant="h5" mb={3}>System Settings</Typography>

            <Paper sx={{ mb: 3 }}>
                <Box p={2}>
                    <Typography variant="h6" gutterBottom>General Settings</Typography>
                </Box>
                <Divider />
                <List>
                    <ListItem>
                        <ListItemText
                            primary="Maintenance Mode"
                            secondary="Prevent non-admin users from accessing the system"
                        />
                        <ListItemSecondaryAction>
                            <Switch edge="end" />
                        </ListItemSecondaryAction>
                    </ListItem>
                    <Divider component="li" />
                    <ListItem>
                        <ListItemText
                            primary="Allow Patient Registration"
                            secondary="Enable public registration for new patients"
                        />
                        <ListItemSecondaryAction>
                            <Switch edge="end" defaultChecked />
                        </ListItemSecondaryAction>
                    </ListItem>
                </List>
            </Paper>

            <Paper>
                <Box p={2}>
                    <Typography variant="h6" gutterBottom>Notifications</Typography>
                </Box>
                <Divider />
                <List>
                    <ListItem>
                        <ListItemText
                            primary="Email Notifications"
                            secondary="Send system alerts via email"
                        />
                        <ListItemSecondaryAction>
                            <Switch edge="end" defaultChecked />
                        </ListItemSecondaryAction>
                    </ListItem>
                    <Divider component="li" />
                    <ListItem>
                        <ListItemText
                            primary="SMS Notifications"
                            secondary="Send urgent alerts via SMS"
                        />
                        <ListItemSecondaryAction>
                            <Switch edge="end" />
                        </ListItemSecondaryAction>
                    </ListItem>
                </List>
            </Paper>
        </Box>
    )
}
