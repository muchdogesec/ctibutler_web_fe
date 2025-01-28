import React, { useContext, useEffect, useRef, useState } from "react";
import {
    Container,
    Typography,
    Table, TableHead, TableRow, TableBody, TableCell,
    Box, Button, Tooltip, Select, MenuItem,
    FormControl,
    InputLabel,
    CircularProgress
} from "@mui/material";
import { useParams } from "react-router-dom";
import { fetchAttackBundle, fetchAttackObject, fetchKnowledgebaseVersions } from "../../../services/ctibutler_api.ts";
import { TeamContext } from "../../../contexts/team-context.tsx";


function AttackDetailPage() {
    const [detailObject, setDetailObject] = useState<any>()
    const [objects, setObjects] = useState<any[]>([])
    const { attack_type, id } = useParams<{ attack_type: string, id: string }>()
    const stixRef = useRef(null);
    const [loading, setLoading] = useState(true)
    const { activeTeam } = useContext(TeamContext);
    const [scriptLoaded, setScriptLoaded] = useState(false);
    const [versions, setVersions] = useState<string[]>([])
    const [selectedVersion, setSelectedVersion] = useState('')

    const getStixObject = (objects: any[]) => {
        const reportUUID = detailObject?.id.split('--')[1]
        return {
            "type": "bundle",
            "id": `bundle--${reportUUID}`,
            "spec_version": "2.1",
            objects: objects,
        }
    }

    const loadStixData = (objects: any[]) => {
        if (objects.length === 0) return

        // eslint-disable-next-line
        const graph = window.stixview.init(
            stixRef.current,
            null,
            () => {
                console.info("Graph loaded");
            },
            {}, // no additional data properties
            {
                hideFooter: false,
                showSidebar: true,
                maxZoom: 50,
                onClickNode: function (node) { }
            }
        );
        const data = getStixObject(objects)
        graph.loadData(data);
    }

    const loadDetailObject = async () => {
        const res = await fetchAttackObject(attack_type || '', id, selectedVersion)
        setDetailObject(res.data.objects[0])
    }
    const loadVersions = async () => {
        const res = await fetchKnowledgebaseVersions(attack_type || '', id)
        let versions: string[] = []
        res.data.forEach(item => {
            versions = [...versions, ...item.versions]
        })
        setVersions(versions)
        setSelectedVersion(versions[0])
    }
    const loadData = async () => {
        if (!id) return
        setLoading(true)
        const objects = await fetchAttackBundle(attack_type || '', id, selectedVersion)
        setObjects(objects)
        setLoading(false)
    }

    useEffect(() => {
        if (scriptLoaded || objects.length > 0) {
            loadStixData(objects)
        }
    }, [objects, scriptLoaded])

    useEffect(() => {
        if (!id) return
        loadDetailObject()
        loadData()
        loadVersions()
    }, [id])

    const changeVersion = (version: string) => {
        setSelectedVersion(version)
        loadDetailObject()
        loadData()
    }

    useEffect(() => {
        document.title = `${id} | CTI Butler`
    }, [])

    const downloadStixObject = async () => {
        const data = getStixObject(objects)
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });

        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        const reportUUID = detailObject?.id.split('--')[1]
        link.download = `bundle--${reportUUID}.json`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        URL.revokeObjectURL(url);
    };

    useEffect(() => {
        const script = document.createElement('script');
        script.src = '/stixview.bundle.js';
        script.async = true;
        script.onload = () => {
            setScriptLoaded(true);
        };

        document.body.appendChild(script);
        return () => {
            document.body.removeChild(script);
        };
    }, []);

    return (
        <Container>
            <Box sx={{ display: 'flex' }}>
                <Box sx={{ flex: 'auto' }}>
                    {loading ? <CircularProgress /> : <></>}
                    <Typography variant="h4">{id}: {detailObject?.name || id}</Typography>
                </Box>
                <FormControl>
                    <InputLabel>Version</InputLabel>
                    <Select
                        value={selectedVersion}
                        label="Version"
                        sx={{ minWidth: '300px' }}
                        onChange={(e) => changeVersion(e.target.value)}
                    >
                        {versions.map((option) =>
                            <MenuItem key={option} value={option}>{option}</MenuItem>
                        )}
                    </Select>
                </FormControl>

            </Box>

            <Typography><p>{detailObject?.description}</p></Typography>
            <Typography sx={{ marginTop: '2rem' }} variant="h5">References</Typography>
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell>Source name</TableCell>
                        <TableCell>Description</TableCell>
                        <TableCell>URL</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {detailObject?.external_references.map(refernce => <TableRow>
                        <TableCell>{refernce.source_name}</TableCell>
                        <TableCell>{refernce.description}</TableCell>
                        <TableCell>{refernce.url}</TableCell>
                    </TableRow>)}
                </TableBody>
            </Table>

            <Typography sx={{ marginTop: '2rem' }} variant="h5">Relationships</Typography>
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell>Relationship type</TableCell>
                        <TableCell>Relationship description</TableCell>
                        <TableCell>Source Object</TableCell>
                        <TableCell>Target Object</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {objects?.filter(object => object?.type === 'relationship').map(refernce => <TableRow>
                        <TableCell>{refernce.relationship_type}</TableCell>
                        <TableCell>{refernce.description}</TableCell>
                        <TableCell>{refernce.source_ref}</TableCell>
                        <TableCell>{refernce.target_ref}</TableCell>
                    </TableRow>)}
                </TableBody>
            </Table>

            <Box sx={{ marginTop: '3rem' }}>
                <Typography variant="h5">CVE Graph</Typography>
                <div ref={stixRef}></div>
                <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                    {(activeTeam?.allowed_data_download) ? (
                        <Button onClick={downloadStixObject} variant='contained'>Download</Button>
                    ) : (<Tooltip title="Your team plan must be upgraded to allow data downloads to download the bundle">
                        <div>
                            <Button variant='contained' disabled={true}>Download</Button>
                        </div>
                    </Tooltip>)}
                </Box>
            </Box>

        </Container>
    );
}

export default AttackDetailPage;
