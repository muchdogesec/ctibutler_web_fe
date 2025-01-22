import React, { useEffect, useRef, useState } from "react";
import {
    Container,
    Typography,
    Table, TableHead, TableRow, TableBody, TableCell
} from "@mui/material";
import { Link, useParams } from "react-router-dom";
import { URLS } from "../../../services/urls.ts";
import { fetchAttackBundle } from "../../../services/ctibutler_api.ts";


function AttackDetailPage() {
    const [detailObject, setDetailObject] = useState<any>()
    const [objects, setObjects] = useState<any[]>([])
    const { id } = useParams<{ id: string }>()
    const stixRef = useRef(null);
    const [loading, setLoading] = useState(true)

    const getStixObject = (objects: any[]) => {
        // const reportId = objects.find(object => object.type === 'report')?.id
        // setReportId(reportId || '')
        return {
            "type": "bundle",
            "id": `bundle--aaaaa`,
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

    const loadData = async () => {
        if (!id) return
        const objects = await fetchAttackBundle(id)
        setObjects(objects)
        setDetailObject(objects.find(item => item.type === 'attack-pattern'))
        setLoading(false)
        loadStixData(objects)
    }

    useEffect(() => {
        if (!id) return
        loadData()
    }, [id])
    useEffect(() => {
        document.title = `Mitre Att&ck | CTI Butler`
    }, [])

    return (
        <Container>
            <Typography variant="h5" > {detailObject?.name || id} </Typography>


            <Typography><span style={{fontWeight: 600}}>ID: </span>{id}</Typography>
            <Typography><span style={{fontWeight: 600}}>Description: </span>{detailObject?.description}</Typography>
            <Typography><span style={{fontWeight: 600}}>ATT&CK Website link: </span>{detailObject?.external_references?.find(reference => reference.source_name === 'mitre-attack')?.url}</Typography>

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
                        <TableCell>Ref ID</TableCell>
                        <TableCell>Ref name</TableCell>
                        <TableCell>Ref Knowledgebase</TableCell>
                        <TableCell>Type</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {objects?.filter(object => object?.type === 'relationship').map(refernce => <TableRow>
                        <TableCell>{refernce.id}</TableCell>
                        <TableCell>{refernce.description}</TableCell>
                        <TableCell>{refernce.url}</TableCell>
                    </TableRow>)}
                </TableBody>
            </Table>

            <div ref={stixRef}></div>

        </Container>
    );
}

export default AttackDetailPage;
