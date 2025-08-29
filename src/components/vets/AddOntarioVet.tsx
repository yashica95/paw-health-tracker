import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { searchOntarioVets, fetchOntarioVetById } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";

interface Props {
  onAdd: (vet: any) => void;
}

export const AddVet = ({ onAdd }: Props) => {
  const { toast } = useToast();
  const [province, setProvince] = useState<string>("");
  const [name, setName] = useState("");
  const [postal, setPostal] = useState("");
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<any[]>([]);

  const searchVets = async () => {
    if (!province || !name.trim()) {
      toast({ title: "Select province and enter vet name", variant: "destructive" });
      return;
    }

    try {
      setLoading(true);
      
      if (province === "ON") {
        console.log("Searching Ontario CVO...");
        // Ontario CVO search
        if (!postal.trim()) {
          toast({ title: "Postal code required for Ontario search", variant: "destructive" });
          return;
        }
        
        console.log("Calling searchOntarioVets with:", { name, address: postal, take: 10 });
        const data = await searchOntarioVets({ name, address: postal, take: 10 });
        console.log("Ontario CVO response:", data);
        
        const list = Array.isArray((data as any)?.result) ? (data as any).result : [];
        console.log("Parsed results list:", list);
        
        setResults(list);
        if (list.length === 0) {
          toast({ title: "No vets found", description: "Try different keywords." });
        } else {
          toast({ title: "Ontario Search successful", description: `Found ${list.length} vet(s) from CVO` });
        }
      } else if (province === "BC") {
        // British Columbia CVBC search
        try {
          console.log("Attempting BC CVBC search for:", name);
          
          // Try to fetch from CVBC using a CORS proxy
          const cvbcUrl = `https://www.cvbc.ca/registrant-lookup-results/?lastname=&firstname=${encodeURIComponent(name)}&preferredname=&specialty=`;
          const corsProxy = "https://api.allorigins.win/raw?url=";
          
          console.log("Making request to:", corsProxy + encodeURIComponent(cvbcUrl));
          
          const response = await fetch(corsProxy + encodeURIComponent(cvbcUrl));
          
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
          
          const html = await response.text();
          console.log("CVBC response received, length:", html.length);
          
          // Parse the HTML table to extract vet information
          const parser = new DOMParser();
          const doc = parser.parseFromString(html, 'text/html');
          const rows = doc.querySelectorAll('table tbody tr');
          
          console.log("Found table rows:", rows.length);
          
          if (rows.length === 0) {
            toast({ title: "No results found", description: "No table data found in CVBC response" });
            return;
          }
          
          const bcResults = Array.from(rows).map(row => {
            const cells = row.querySelectorAll('td');
            if (cells.length >= 7) {
              const fullName = cells[0]?.textContent?.trim() || '';
              const preferredName = cells[1]?.textContent?.trim() || '';
              const practiceType = cells[2]?.textContent?.trim() || '';
              const licenseStatus = cells[3]?.textContent?.trim() || '';
              const type = cells[4]?.textContent?.trim() || '';
              const specialty = cells[5]?.textContent?.trim() || '';
              
              // Ensure all values are strings and not empty
              return {
                id: `bc-${fullName.replace(/\s+/g, '-').toLowerCase()}`,
                fullName: String(fullName || 'Unknown'),
                preferredName: String(preferredName || ''),
                practiceType: String(practiceType || 'Unknown'),
                licenseStatus: String(licenseStatus || 'Unknown'),
                type: String(type || 'Veterinarian'),
                specialty: String(specialty || ''),
                province: 'BC',
                source: 'CVBC'
              };
            }
            return null;
          }).filter(Boolean);
          
          console.log("Parsed BC results:", bcResults);
          
          if (bcResults.length === 0) {
            toast({ title: "No vets found", description: "Try different keywords or check CVBC directly." });
          } else {
            setResults(bcResults);
            toast({ title: "BC Search successful", description: `Found ${bcResults.length} vet(s) from CVBC` });
          }
          
        } catch (error: any) {
          console.error('BC CVBC search error:', error);
          
          toast({ 
            title: "BC Search Failed", 
            description: "Showing sample data. You can search CVBC directly.", 
            variant: "destructive" 
          });
          
          // Fallback: show sample data and offer to open CVBC
          const sampleResults = [
            {
              id: 'bc-sample-1',
              fullName: 'Dr. John Smith',
              preferredName: 'John',
              practiceType: 'Private Practice',
              licenseStatus: 'License - Full',
              type: 'Veterinarian',
              specialty: 'General Practice',
              province: 'BC',
              source: 'CVBC'
            }
          ];
          
          setResults(sampleResults);
          
          // Offer to open CVBC website
          setTimeout(() => {
            if (confirm("Would you like to open the CVBC website to search manually?")) {
              const cvbcUrl = `https://www.cvbc.ca/registrant-lookup-results/?lastname=&firstname=${encodeURIComponent(name)}&preferredname=&specialty=`;
              window.open(cvbcUrl, '_blank');
            }
          }, 1000);
        }
      }
    } catch (e: any) {
      toast({ title: "Lookup failed", description: e.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const addVet = async (vet: any) => {
    try {
      if (vet.source === 'CVBC') {
        // For BC vets, create a standardized vet record
        const vetRecord = {
          id: vet.id,
          source: 'CVBC-BC',
          firstName: vet.fullName.split(' ')[0] || '',
          lastName: vet.fullName.split(' ').slice(1).join(' ') || '',
          salutationName: `Dr. ${vet.fullName}`,
          clinicName: vet.practiceType,
          phone: '',
          email: '',
          address: '',
          city: '',
          province: 'BC',
          postalCode: '',
          registrationStatus: vet.licenseStatus,
          classOfRegistration: vet.type,
          education: '',
          licenseHistory: [{
            status: vet.licenseStatus,
            className: vet.type,
            from: new Date().toISOString().slice(0, 10),
            to: undefined
          }]
        };
        onAdd(vetRecord);
        toast({ title: "Vet added", description: vetRecord.salutationName });
      } else {
        // Ontario CVO vet - fetch full details
        setLoading(true);
        const detail = await fetchOntarioVetById(vet.id);
        const phone = detail?.primarypractice?.telephone || detail?.telephone1 || '';
        const vetRecord = {
          id: detail?.id,
          source: 'CVO-ON',
          firstName: detail?.firstName,
          lastName: detail?.lastName,
          salutationName: detail?.salutationName,
          clinicName: detail?.primarypractice?.name,
          phone,
          email: detail?.primarypractice?.email || detail?.email1 || '',
          address: [detail?.primarypractice?.street1, detail?.primarypractice?.street2].filter(Boolean).join(' '),
          city: detail?.primarypractice?.city,
          province: detail?.primarypractice?.province || 'ON',
          postalCode: detail?.primarypractice?.postalCode,
          registrationStatus: detail?.registrationStatus?.name,
          classOfRegistration: detail?.classOfRegistration?.name,
          education: Array.isArray(detail?.education) ? detail.education.map((e:any)=>`${e.name} (${e.graduationYear||''})`).join(', ') : '',
          licenseHistory: Array.isArray(detail?.registrationRecords) ? detail.registrationRecords.map((rec:any)=>({ status: rec?.registrationStatus?.name || '', className: rec?.classOfRegistration?.name || '', from: rec?.effectiveDate || '', to: rec?.effectiveEndDate || undefined })) : []
        };
        onAdd(vetRecord);
        toast({ title: "Vet added", description: vetRecord.salutationName });
      }
      
      setResults([]);
    } catch (e: any) {
      toast({ title: "Failed to add vet", description: e.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
        <Select value={province} onValueChange={setProvince}>
          <SelectTrigger>
            <SelectValue placeholder="Select Province" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ON">Ontario</SelectItem>
            <SelectItem value="BC">British Columbia</SelectItem>
          </SelectContent>
        </Select>
        
        <Input 
          placeholder="Vet name" 
          value={name} 
          onChange={(e) => setName(e.target.value)} 
        />
        
        {province === "ON" && (
          <Input 
            placeholder="Postal code (e.g., M5A 1P9)" 
            value={postal} 
            onChange={(e) => setPostal(e.target.value)} 
          />
        )}
        
        {province === "BC" && (
          <div className="text-sm text-muted-foreground flex items-center justify-center">
            BC search by name only
          </div>
        )}
      </div>
      
      <Button 
        variant="secondary" 
        onClick={searchVets} 
        disabled={loading || !province || !name.trim() || (province === "ON" && !postal.trim())}
        className="w-full"
      >
        Search {province === "ON" ? "Ontario CVO" : province === "BC" ? "BC CVBC" : "Vets"}
      </Button>
      
      {results.length > 0 && (
        <div className="mt-4 max-h-48 overflow-auto border rounded-md p-2 text-sm">
          <div className="text-xs text-muted-foreground mb-2">{results.length} result(s) found</div>
          {results.map((r: any) => (
            <div key={r.id} className="flex items-center justify-between p-2 rounded hover:bg-muted/50">
              <div>
                <div className="font-medium">
                  {(() => {
                    // Safely extract and display the vet name
                    if (r.fullName) return String(r.fullName);
                    if (r.firstName && r.lastName) return `${String(r.firstName)} ${String(r.lastName)}`;
                    if (r.firstName) return String(r.firstName);
                    if (r.lastName) return String(r.lastName);
                    return 'Unknown Name';
                  })()}
                </div>
                {/* Location information */}
                <div className="text-xs text-muted-foreground mt-1">
                  {(() => {
                    if (r.source === 'CVBC') {
                      // BC vets - show practice type and province
                      return `${r.practiceType || 'Unknown Practice'} • ${r.province || 'BC'}`;
                    } else {
                      // Ontario vets - show address information
                      const locationParts = [];
                      
                      // Extract address from searchaddress (initial search results)
                      if (r.searchaddress?.address) locationParts.push(String(r.searchaddress.address));
                      if (r.searchaddress?.city) locationParts.push(String(r.searchaddress.city));
                      if (r.searchaddress?.postalcode) locationParts.push(String(r.searchaddress.postalcode));
                      
                      // Extract address from primary practice (detailed results)
                      if (r.primarypractice?.street1) {
                        const address = [r.primarypractice.street1, r.primarypractice.street2].filter(Boolean).join(' ');
                        if (address) locationParts.push(String(address));
                      }
                      if (r.primarypractice?.city) locationParts.push(String(r.primarypractice.city));
                      if (r.primarypractice?.postalCode) locationParts.push(String(r.primarypractice.postalCode));
                      
                      // If no detailed address, show province
                      if (locationParts.length === 0) {
                        locationParts.push(r.province || 'ON');
                      }
                      
                      return locationParts.join(', ');
                    }
                  })()}
                </div>
              </div>
              <Button size="sm" onClick={() => addVet(r)} disabled={loading}>Add</Button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AddVet;

